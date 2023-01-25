class RemoveInGameFromWaitrooms < ActiveRecord::Migration[7.0]
  def change
    remove_column :waitrooms, :inGame, :integer
  end
end
