class AddHostIdToGame < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :host_id, :integer
  end
end
