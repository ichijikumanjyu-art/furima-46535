# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    nickname              { 'テストユーザー' }
    email                 { Faker::Internet.unique.email }
    password              { 'abc123' }
    password_confirmation { 'abc123' }
    last_name             { '山田' }        # 全角
    first_name            { '陸太郎' }        # 全角
    last_name_kana        { 'ヤマダ' }      # 全角カタカナ
    first_name_kana       { 'リクタロウ' }      # 全角カタカナ
    birth                 { '1990-01-01' }  # 生年月日（任意の日付）
  end
end
