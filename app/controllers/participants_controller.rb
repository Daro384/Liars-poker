class ParticipantsController < ApplicationController
    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity_response
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_response

    def index
        render json: Participant.all
    end

    def create
        participant = Participant.create!(participant_params)
        render json: participant, status: :created
    end

    def destroy
        participant = Participant.find_by!(player_id: params[:id])
        participant.destroy
        head :no_content
    end

    private
    #strong parameters
    def participant_params
        params.permit(:player_id, :host_id, :display_name)
    end

    def render_unprocessable_entity_response(exception)
        render json: {errors: exception.record.errors.full_messages}, status: :unprocessable_entity
    end

    def render_not_found_response
        render json: { error: "Participant not found" }, status: :not_found
    end
end
