class AddMileageToCars < ActiveRecord::Migration
  def change
    add_column :cars, :mileage, :integer
  end
end
