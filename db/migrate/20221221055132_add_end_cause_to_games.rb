class AddEndCauseToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :end_cause, :string
  end
end
