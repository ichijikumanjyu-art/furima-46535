class ItemsController < ApplicationController
  before_action :authenticate_user!, only: [:new]

  def index
  end

  def new
    @user = User.new
    @item = Item.new
  end

  private

  def item_params
    params.require(:item).permit(
      :product,
      :introduce,
      :price,
      :category_id,
      :condition_id,
      :shipping_cost_id,
      :prefecture_id,
      :shipping_date_id,
      :image
    ).merge(user_id: current_user.id)
  end

end
