require 'rails_helper'

RSpec.describe 'Orders', type: :request do
  let(:user) { create(:user) }
  let(:item) { create(:item) }
  let(:another_user) { create(:user) }
  let(:basic_auth_user) { ENV['BASIC_AUTH_USER'] || 'test_user' } 
  let(:basic_auth_password) { ENV['BASIC_AUTH_PASSWORD'] || 'test_password' }
  let(:basic_auth_header) do
    { 'Authorization' => ActionController::HttpAuthentication::Basic.encode_credentials(basic_auth_user, basic_auth_password) }
  end
  let(:order_address_params) do
    {
      post_code: '123-4567',
      prefecture_id: 2,
      city: '横浜市',
      street: '青山1-1-1',
      building: '柳ビル103',
      phone_number: '09012345678',
      token: 'tok_xxxxxxxxxxxxxxxxxxxxxxxxx',
      user_id: user.id,   
      item_id: item.id
    }
  end

  include Devise::Test::IntegrationHelpers

  before do
    sign_in user 
  end

  before do
    # Payjp::Charge.createの呼び出しをモック化
    allow(Payjp::Charge).to receive(:create).and_return(Payjp::Charge.new(id: 'ch_test_id', livemode: false, amount: item.price)) 
  end

  describe 'GET #index' do
    it '購入画面が表示されること' do
      get item_orders_path(item), headers: basic_auth_header
      expect(response).to have_http_status(:success)
    end

    it '未ログインユーザーはリダイレクトされること' do
      # sign_outを使用
      sign_out user 
      get item_orders_path(item), headers: basic_auth_header
      expect(response).to redirect_to(new_user_session_path)
    end

    it '出品者は購入画面にアクセスできないこと' do
      item.update(user: user)
      # ログイン状態はbeforeで維持されている
      get item_orders_path(item) , headers: basic_auth_header
      expect(response).to redirect_to(root_path)
    end

    it '売り切れ商品は購入画面にアクセスできないこと' do
      # Order作成時に、購入者（userとは別のユーザー）を指定する
      create(:order, item: item, user: another_user) 
      get item_orders_path(item), headers: basic_auth_header
      expect(response).to redirect_to(root_path)
    end
  end

  describe 'POST #create' do
    context '有効なパラメータの場合' do
      it '注文が作成されること' do
        expect do
          post item_orders_path(item), params: { order_address: order_address_params }, headers: basic_auth_header
        end.to change(Order, :count).by(1).and change(Address, :count).by(1)
        expect(response).to have_http_status(:redirect)
      end

      it 'ルートパスにリダイレクトされること' do
        post item_orders_path(item), params: { order_address: order_address_params }, headers: basic_auth_header
        expect(response).to redirect_to(root_path)
      end
    end

    context '無効なパラメータの場合' do
      it '注文が作成されないこと' do
        invalid_params = order_address_params.merge(post_code: '')
        expect do
          post item_orders_path(item), params: { order_address: invalid_params }, headers: basic_auth_header
        end.not_to change(Order, :count)
      end

      it '購入画面が再表示されること' do
        invalid_params = order_address_params.merge(post_code: '')
        post item_orders_path(item), params: { order_address: invalid_params }, headers: basic_auth_header
        # ステータスコードを数値の422に修正
        expect(response).to have_http_status(422) 
      end
    end
  end
end