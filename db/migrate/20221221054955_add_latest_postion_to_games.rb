class AddLatestPostionToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :latest_position, :string
  end
end
