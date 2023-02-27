class CreatePlayers < ActiveRecord::Migration[7.0]
  def change
    create_table :players do |t|
      t.integer :game_id
      t.integer :player_id
      t.string :display_name

      t.timestamps
    end
  end
end
