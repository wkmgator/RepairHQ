"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useIsRtl } from "@/lib/rtl-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react"

export function RtlTestClient() {
  const t = useTranslations("rtlTest")
  const isRtl = useIsRtl()
  const [dialogOpen, setDialogOpen] = useState(false)

  // Determine directional icons based on RTL
  const BackIcon = isRtl ? ArrowRight : ArrowLeft
  const ForwardIcon = isRtl ? ArrowLeft : ArrowRight

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("textAlignment")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="mb-2">{t("paragraphExample")}</p>
            <p className="text-muted-foreground">{t("longText")}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">{t("listExample")}</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>{t("listItem1")}</li>
              <li>{t("listItem2")}</li>
              <li>{t("listItem3")}</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("buttons")}</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">{t("defaultButton")}</Button>

          <Button variant="outline">{t("outlineButton")}</Button>

          <Button variant="secondary">{t("secondaryButton")}</Button>

          <Button variant="destructive">{t("destructiveButton")}</Button>

          <Button variant="ghost">{t("ghostButton")}</Button>

          <Button variant="link">{t("linkButton")}</Button>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <Button>
            <BackIcon className="mr-2 h-4 w-4" />
            {t("back")}
          </Button>

          <Button>
            {t("forward")}
            <ForwardIcon className="ml-2 h-4 w-4" />
          </Button>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("create")}
          </Button>

          <Button variant="outline">
            <Check className="mr-2 h-4 w-4" />
            {t("select")}
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("forms")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" placeholder={t("namePlaceholder")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" placeholder={t("emailPlaceholder")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">{t("country")}</Label>
              <Select>
                <SelectTrigger id="country">
                  <SelectValue placeholder={t("selectCountry")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">{t("unitedStates")}</SelectItem>
                  <SelectItem value="ca">{t("canada")}</SelectItem>
                  <SelectItem value="uk">{t("unitedKingdom")}</SelectItem>
                  <SelectItem value="au">{t("australia")}</SelectItem>
                  <SelectItem value="jp">{t("japan")}</SelectItem>
                  <SelectItem value="sa">{t("saudiArabia")}</SelectItem>
                  <SelectItem value="ae">{t("uae")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("gender")}</Label>
              <RadioGroup defaultValue="male">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">{t("male")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">{t("female")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">{t("other")}</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>{t("preferences")}</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="emails" />
                  <Label htmlFor="emails">{t("receiveEmails")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sms" />
                  <Label htmlFor="sms">{t("receiveSms")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="promotions" />
                  <Label htmlFor="promotions">{t("receivePromotions")}</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("cards")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("basicCard")}</CardTitle>
              <CardDescription>{t("basicCardDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t("cardContent")}</p>
            </CardContent>
            <CardFooter>
              <Button>{t("action")}</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("featuredCard")}</CardTitle>
              <CardDescription>{t("featuredCardDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("item")} 1</span>
                  <span>$10.00</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("item")} 2</span>
                  <span>$15.00</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("item")} 3</span>
                  <span>$20.00</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost">{t("cancel")}</Button>
              <Button>{t("checkout")}</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("infoCard")}</CardTitle>
              <CardDescription>{t("infoCardDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>{t("infoCardContent")}</p>
                <Button variant="link" className="p-0">
                  {t("learnMore")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("tables")}</h2>
        <Table>
          <TableCaption>{t("tableCaption")}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t("id")}</TableHead>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead className="text-right">{t("amount")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>001</TableCell>
              <TableCell>{t("person1")}</TableCell>
              <TableCell>john@example.com</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>002</TableCell>
              <TableCell>{t("person2")}</TableCell>
              <TableCell>jane@example.com</TableCell>
              <TableCell className="text-right">$150.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>003</TableCell>
              <TableCell>{t("person3")}</TableCell>
              <TableCell>bob@example.com</TableCell>
              <TableCell className="text-right">$350.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>004</TableCell>
              <TableCell>{t("person4")}</TableCell>
              <TableCell>alice@example.com</TableCell>
              <TableCell className="text-right">$450.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("tabs")}</h2>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">{t("account")}</TabsTrigger>
            <TabsTrigger value="password">{t("password")}</TabsTrigger>
            <TabsTrigger value="settings">{t("settings")}</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="p-4 border rounded-md mt-2">
            <h3 className="text-lg font-medium mb-2">{t("accountSettings")}</h3>
            <p>{t("accountTabContent")}</p>
          </TabsContent>
          <TabsContent value="password" className="p-4 border rounded-md mt-2">
            <h3 className="text-lg font-medium mb-2">{t("passwordSettings")}</h3>
            <p>{t("passwordTabContent")}</p>
          </TabsContent>
          <TabsContent value="settings" className="p-4 border rounded-md mt-2">
            <h3 className="text-lg font-medium mb-2">{t("generalSettings")}</h3>
            <p>{t("settingsTabContent")}</p>
          </TabsContent>
        </Tabs>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("dialogs")}</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>{t("openDialog")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("dialogTitle")}</DialogTitle>
              <DialogDescription>{t("dialogDescription")}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>{t("dialogContent")}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={() => setDialogOpen(false)}>{t("continue")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  )
}
