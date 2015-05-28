class AddZipToCars < ActiveRecord::Migration
  def change
    add_column :cars, :zip, :integer
  end
end
