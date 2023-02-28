class AddLoserToGame < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :loser, :string
  end
end
