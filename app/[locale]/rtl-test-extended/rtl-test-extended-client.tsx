"use client"

import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsRtl } from "@/lib/rtl-utils"
import { useNumberFormatter, useCurrencyFormatter, useDateFormatter } from "@/lib/format-utils"

export default function RtlTestExtendedClient() {
  const t = useTranslations("RTLTest")
  const locale = useLocale()
  const isRtl = useIsRtl()
  const numberFormatter = useNumberFormatter()
  const currencyFormatter = useCurrencyFormatter()
  const dateFormatter = useDateFormatter({ dateStyle: "full" })

  const [inputValue, setInputValue] = useState("")

  // Sample data for formatting examples
  const number = 1234567.89
  const price = 9999.99
  const date = new Date()

  return (
    <Tabs defaultValue="farsi" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="farsi">فارسی (Farsi)</TabsTrigger>
        <TabsTrigger value="urdu">اردو (Urdu)</TabsTrigger>
      </TabsList>

      <TabsContent value="farsi" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>تست زبان فارسی</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              این یک متن آزمایشی به زبان فارسی است. سیستم باید بتواند این متن را به درستی نمایش دهد.
            </p>

            <div className="grid gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="farsi-input">ورود متن به فارسی:</Label>
                <Input
                  id="farsi-input"
                  placeholder="لطفا متن فارسی وارد کنید..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>فرمت اعداد:</Label>
                <div className="p-2 border rounded">{numberFormatter.format(number)}</div>
              </div>

              <div className="space-y-2">
                <Label>فرمت قیمت:</Label>
                <div className="p-2 border rounded">{currencyFormatter.format(price)}</div>
              </div>

              <div className="space-y-2">
                <Label>فرمت تاریخ:</Label>
                <div className="p-2 border rounded">{dateFormatter.format(date)}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">لغو</Button>
              <Button>تایید</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="urdu" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>اردو زبان کا ٹیسٹ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">یہ اردو زبان میں ایک ٹیسٹ متن ہے۔ سسٹم کو اس متن کو صحیح طریقے سے دکھانا چاہیے۔</p>

            <div className="grid gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="urdu-input">اردو میں متن درج کریں:</Label>
                <Input
                  id="urdu-input"
                  placeholder="براہ کرم اردو متن درج کریں..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>نمبر فارمیٹنگ:</Label>
                <div className="p-2 border rounded">{numberFormatter.format(number)}</div>
              </div>

              <div className="space-y-2">
                <Label>قیمت فارمیٹنگ:</Label>
                <div className="p-2 border rounded">{currencyFormatter.format(price)}</div>
              </div>

              <div className="space-y-2">
                <Label>تاریخ فارمیٹنگ:</Label>
                <div className="p-2 border rounded">{dateFormatter.format(date)}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">منسوخ کریں</Button>
              <Button>جمع کرائیں</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
