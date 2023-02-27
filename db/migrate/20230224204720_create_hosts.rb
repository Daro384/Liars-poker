class CreateHosts < ActiveRecord::Migration[7.0]
  def change
    create_table :hosts do |t|
      t.integer :player_id
      t.string :lobby_name
      t.string :rng_seed

      t.timestamps
    end
  end
end
