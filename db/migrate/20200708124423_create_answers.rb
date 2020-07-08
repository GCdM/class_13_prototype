class CreateAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :answers do |t|
      t.references :prompt, null: false, foreign_key: true
      t.references :participant, null: false, foreign_key: true

      t.timestamps
    end
  end
end
