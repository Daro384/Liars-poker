class GamesController < ApplicationController
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_response
    
    def index
        render json: Game.all
    end

    def show
        game = Game.find_by!(id: params[:id])
        render json: game
    end

    def show_by_userId
        white_games = Game.where("white_player_id = #{params[:id]}")
        black_games = Game.where("black_player_id = #{params[:id]}")
        my_games = [*white_games, *black_games]
        render json: my_games
    end

    def update
        game = Game.find_by!(id: params[:id])
        game.update!(game_update_params)
        render json: game, status: :created
    end

    def create
        game = Game.create!(game_params)
        render json: game, status: :created
    end

    private

    def game_update_params
        params.permit(:ongoing, :latest_position, :winner, :end_cause, :time, :increment_time)
    end

    def game_params
        params.permit(:white_player_id, :black_player_id, :ongoing, :latest_position, :winner, :end_cause, :time, :increment_time)
    end

    def render_unprocessable_entity_response(exception)
        render json: {errors: exception.record.errors.full_messages}, status: :unprocessable_entity
    end

    def render_not_found_response
        render json: { error: "Game not found" }, status: :not_found
    end
end
