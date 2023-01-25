class CreateChats < ActiveRecord::Migration[7.0]
  def change
    create_table :chats do |t|
      t.string :message
      t.string :user_id
      t.string :game_id

      t.timestamps
    end
  end
end
