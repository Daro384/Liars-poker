class CreateWaitrooms < ActiveRecord::Migration[7.0]
  def change
    create_table :waitrooms do |t|
      t.integer :player_id
      t.integer :rating
      t.integer :invite
      t.boolean :inGame

      t.timestamps
    end
  end
end
