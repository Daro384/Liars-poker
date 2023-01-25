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
        render json: Waitroom.all
    end

    def update
        user = Waitroom.find_by!(id: params[:id])
        user.update!(waiter_params)
        render json: user, status: :created
    end

    def show
        render json: Waitroom.find(params[:id])
    end

    private

    def waiter_params
        params.permit(:player_id, :rating, :opponent)
    end

    def render_unprocessable_entity_response(exception)
        render json: {errors: exception.record.errors.full_messages}, status: :unprocessable_entity
    end

    def render_not_found_response
        render json: { error: "User not found" }, status: :not_found
    end
end
