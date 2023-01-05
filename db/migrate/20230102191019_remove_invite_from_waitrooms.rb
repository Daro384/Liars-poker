class RemoveInviteFromWaitrooms < ActiveRecord::Migration[7.0]
  def change
    remove_column :waitrooms, :invite, :integer
  end
end
