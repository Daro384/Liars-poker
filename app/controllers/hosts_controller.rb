class HostsController < ApplicationController
    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity_response
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_response

    def index
        render json: Host.all
    end

    def create
        host = Host.create!(host_params)
        render json: host, status: :created
    end

    def destroy
        host = Host.find(params[:id])
        host.destroy
        head :no_content
    end

    private
    #strong parameters
    def host_params
        params.permit(:player_id, :lobby_name, :rng_seed)
    end

    def render_unprocessable_entity_response(exception)
        render json: {errors: exception.record.errors.full_messages}, status: :unprocessable_entity
    end

    def render_not_found_response
        render json: { error: "Host not found" }, status: :not_found
    end
end
