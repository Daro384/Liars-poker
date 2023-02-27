class CreateMoves < ActiveRecord::Migration[7.0]
  def change
    create_table :moves do |t|
      t.integer :game_id
      t.integer :player_id
      t.string :hand

      t.timestamps
    end
  end
end
