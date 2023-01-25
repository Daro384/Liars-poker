class AddIncrementToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :increment_time, :integer
  end
end
