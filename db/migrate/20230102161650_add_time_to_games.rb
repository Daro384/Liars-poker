class AddTimeToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :time, :integer
  end
end
