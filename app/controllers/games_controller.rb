class GamesController < ApplicationController
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_response
    
    def index
        render json: Game.all
    end

    def show
        game = Game.find_by!(id: params[:id])
        render json: game
    end

    def update
        game = Game.find_by!(id: params[:id])
        game.update!(game_update_params)
        render json: game
    end

    private

    def game_update_params
        params.permit(:ongoing, :latest_position, :winner, :end_cause)
    end

    def render_unprocessable_entity_response(exception)
        render json: {errors: exception.record.errors.full_messages}, status: :unprocessable_entity
    end

    def render_not_found_response
        render json: { error: "Game not found" }, status: :not_found
    end
end
