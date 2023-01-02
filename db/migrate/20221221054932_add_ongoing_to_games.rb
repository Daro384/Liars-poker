class AddOngoingToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :ongoing, :boolean
  end
end
