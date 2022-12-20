class WaitroomsController < ApplicationController
    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity_response
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_response

    def create
        user = Waitroom.create!(waiter_params)
        if user.valid?
            render json: user, status: :created
        else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def destroy
        user = Waitroom.find_by!(id: params[:id])
        user.destroy
        head :no_content
    end

    def index
        me = Waitroom.find_by!(player_id: session[:user_id])
        my_id = me[:player_id]
        myInvite = me[:invite]

        if me[:inGame] 
            #find game and add myself to game
            our_game = Game.find(me[:inGame])
            
            our_game.update(black_player_id:my_id)
            #delete us both from the Waitroom
            render json: {game_id: our_game[:id]}

        elsif myInvite
            #find the person who invited me
            theInviter = Waitroom.find_by!(player_id: myInvite)
            
            if theInviter[:invite] == my_id
                #create new game with me as white and set inviter's inGame to the game ID
                new_game = Game.create!(white_player_id: my_id, black_player_id:nil, winner:nil)
                game_id = new_game[:id]
                theInviter.update(inGame: game_id)
                render json: {game_id: game_id}
            else
                #accept invite by tagging his invite with my ID
                theInviter.update(invite: my_id)
                render json: {response: "accepted invite"}
            end

        elsif Waitroom.count <= 1
            render json: {response: 'Not enough players to create a game'}
            #got no invite

        else
            #find and send invite to valid player
            worthy_opponent = Waitroom.all.where("player_id != #{session[:user_id]}").first  #change this to take rating into account later
            worthy_opponent.update(invite: my_id)
            render json: worthy_opponent
        end

    end

    private

    def waiter_params
        params.permit(:player_id, :rating, :invite, :inGame)
    end

    def render_unprocessable_entity_response(exception)
        render json: {errors: exception.record.errors.full_messages}, status: :unprocessable_entity
    end

    def render_not_found_response
        render json: { error: "User not found" }, status: :not_found
    end
end
