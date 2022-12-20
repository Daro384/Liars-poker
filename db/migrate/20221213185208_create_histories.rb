class CreateHistories < ActiveRecord::Migration[7.0]
  def change
    create_table :histories do |t|
      t.string :chess_game
      t.integer :user1_id
      t.integer :user1_rating
      t.integer :user2_id
      t.integer :user2_rating

      t.timestamps
    end
  end
end
