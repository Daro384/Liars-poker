class UsersController < ApplicationController
    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity_response
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_response

    def index
        render json: User.all
    end

    def show
        user = User.find_by!(id: session[:user_id])
        if user
            render json: user, status: :ok
        else
            render json: {error: "not authorized"}, status: :unauthorized
        end
    end

    def create
        user = User.create!(user_params)
        if user.valid?
            render json: user, status: :created
        else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
    end

    private
    #strong parameters
    def user_params
        params.permit(:username, :password, :rating)
    end

    def render_unprocessable_entity_response(exception)
        render json: {errors: exception.record.errors.full_messages}, status: :unprocessable_entity
    end

    def render_not_found_response
        render json: { error: "User not found" }, status: :not_found
    end
end
