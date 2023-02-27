class MovesController < ApplicationController
    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity_response
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_response

    def index
        render json: Move.all
    end

    def create
        move = Move.create!(move_params)
        render json: move, status: :created
    end

    private
    #strong parameters
    def move_params
        params.permit(:game_id, :player_id, :hand)
    end

    def render_unprocessable_entity_response(exception)
        render json: {errors: exception.record.errors.full_messages}, status: :unprocessable_entity
    end

    def render_not_found_response
        render json: { error: "Move not found" }, status: :not_found
    end
end
