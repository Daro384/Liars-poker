class AddTimeControlsToWaitroom < ActiveRecord::Migration[7.0]
  def change
    add_column :waitrooms, :time, :integer
    add_column :waitrooms, :time_increment, :integer
  end
end
