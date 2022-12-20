class CreatePlies < ActiveRecord::Migration[7.0]
  def change
    create_table :plies do |t|
      t.integer :game_id
      t.integer :move_index
      t.string :color
      t.string :move

      t.timestamps
    end
  end
end
