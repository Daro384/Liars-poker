class AddDisplayNameToParticipants < ActiveRecord::Migration[7.0]
  def change
    add_column :participants, :display_name, :string
  end
end
