class CreateItems < ActiveRecord::Migration[7.1]
  def change
    create_table :items do |t|
      t.string     :product,           null: false
      t.text       :introduce,         null: false
      t.integer    :price,             null: false
      t.references :user,              null: false, foreign_key: true
      t.integer    :category_id,       null: false
      t.integer    :condition_id,      null: false
      t.integer    :shipping_cost_id,  null: false
      t.integer    :prefecture_id,     null: false
      t.integer    :shipping_date_id,  null: false

      t.timestamps
    end
  end
end
