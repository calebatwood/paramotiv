class RenameZipInCars < ActiveRecord::Migration
  def change
    change_column :cars, :zip, :string
  end
end
