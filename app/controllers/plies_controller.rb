class PliesController < ApplicationController
    
    def create
        ply = Ply.create!(ply_params)
        if ply.valid?
            render json: ply, status: :created
        else
            render json: { errors: ply.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def index
        render json: Ply.all
    end

    private
    def ply_params
        params.permit(:game_id, :move_index, :move, :color)
    end

end
