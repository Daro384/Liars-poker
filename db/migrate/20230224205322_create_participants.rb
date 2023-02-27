class CreateParticipants < ActiveRecord::Migration[7.0]
  def change
    create_table :participants do |t|
      t.integer :host_id
      t.integer :player_id

      t.timestamps
    end
  end
end
