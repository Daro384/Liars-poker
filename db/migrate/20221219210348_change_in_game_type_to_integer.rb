class ChangeInGameTypeToInteger < ActiveRecord::Migration[7.0]
  def change
    change_column :waitrooms, :inGame, :integer
  end
end
