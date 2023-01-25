class AddTimeRemainingToPlies < ActiveRecord::Migration[7.0]
  def change
    add_column :plies, :time_remaining, :integer
  end
end
