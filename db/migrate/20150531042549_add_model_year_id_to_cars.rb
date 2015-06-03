class AddModelYearIdToCars < ActiveRecord::Migration
  def change
    add_column :cars, :model_year_id, :integer
  end
end
