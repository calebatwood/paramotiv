class AddStyleIdToCars < ActiveRecord::Migration
  def change
    add_column :cars, :style_id, :integer
  end
end
