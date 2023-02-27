class CreateGames < ActiveRecord::Migration[7.0]
  def change
    create_table :games do |t|
      t.string :lobby_name
      t.boolean :ongoing
      t.string :rng_hash

      t.timestamps
    end
  end
end
