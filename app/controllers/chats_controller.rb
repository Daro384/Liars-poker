class ChatsController < ApplicationController
    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity_response
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_response

    def create
        chat = Chat.create!(chat_params)
        render json: chat, status: :created
    end

    private

    def chat_params
        params.permit(:message, :user_id, :game_id)
    end

    def render_unprocessable_entity_response(exception)
        render json: {errors: exception.record.errors.full_messages}, status: :unprocessable_entity
    end

    def render_not_found_response
        render json: { error: "Message not found" }, status: :not_found
    end
    
end
