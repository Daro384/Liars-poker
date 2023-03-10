class GamesController < ApplicationController
    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity_response
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_response

    def index
        render json: Game.all
    end

    def create
        game = Game.create!(game_params)
        render json: game, status: :created
    end

    def destroy
        game = Game.find(params[:id])
        game.destroy
        head :no_content
    end

    def update
        game = Game.find(params[:id])
        game.update!(game_params)
        render json: game, status: :created
    end

    private
    #strong parameters
    def game_params
        params.permit(:lobby_name, :ongoing, :rng_hash)
    end

    def render_unprocessable_entity_response(exception)
        render json: {errors: exception.record.errors.full_messages}, status: :unprocessable_entity
    end

    def render_not_found_response
        render json: { error: "Game not found" }, status: :not_found
    end
end
