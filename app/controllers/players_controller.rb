class PlayersController < ApplicationController
    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity_response
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_response

    def index
        render json: Player.all
    end

    def create
        player = Player.create!(player_params)
        render json: player, status: :created
    end

    private
    #strong parameters
    def player_params
        params.permit(:player_id, :display_name, :game_id)
    end

    def render_unprocessable_entity_response(exception)
        render json: {errors: exception.record.errors.full_messages}, status: :unprocessable_entity
    end

    def render_not_found_response
        render json: { error: "Player not found" }, status: :not_found
    end
end
