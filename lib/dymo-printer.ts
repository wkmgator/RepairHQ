declare global {
  interface Window {
    dymo: any
  }
}

export interface TicketLabelData {
  customerName: string
  deviceType: string
  ticketId: string
  repairType: string
  dateCreated: string
  qrCodeData?: string
}

export interface PartLabelData {
  partName: string
  sku: string
  location?: string
  price?: number
  vendor?: string
  barcode?: string
}

export class DymoPrinter {
  private static instance: DymoPrinter
  private isReady = false

  private constructor() {}

  static getInstance(): DymoPrinter {
    if (!DymoPrinter.instance) {
      DymoPrinter.instance = new DymoPrinter()
    }
    return DymoPrinter.instance
  }

  async init(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.dymo) {
        window.dymo.label.framework.init(() => {
          this.isReady = true
          resolve(true)
        })
      } else {
        console.error("DYMO Label Framework not loaded")
        resolve(false)
      }
    })
  }

  getPrinters(): string[] {
    if (!this.isReady) return []

    try {
      const printers = window.dymo.label.framework.getPrinters()
      return printers.filter((p: any) => p.isConnected).map((p: any) => p.name)
    } catch (error) {
      console.error("Error getting printers:", error)
      return []
    }
  }

  createTicketLabel(data: TicketLabelData): string {
    return `<?xml version="1.0" encoding="utf-8"?>
    <DieCutLabel Version="8.0" Units="twips">
      <PaperOrientation>Landscape</PaperOrientation>
      <Id>Address</Id>
      <PaperName>30252 Address</PaperName>
      <DrawCommands>
        <RoundRectangle X="0" Y="0" Width="1581" Height="5040" Rx="270" Ry="270" />
      </DrawCommands>
      <ObjectInfo>
        <TextObject>
          <Name>Customer</Name>
          <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
          <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
          <LinkedObjectName></LinkedObjectName>
          <Rotation>Rotation0</Rotation>
          <IsMirrored>False</IsMirrored>
          <IsVariable>True</IsVariable>
          <HorizontalAlignment>Left</HorizontalAlignment>
          <VerticalAlignment>Top</VerticalAlignment>
          <TextFitMode>ShrinkToFit</TextFitMode>
          <UseFullFontHeight>True</UseFullFontHeight>
          <Verticalized>False</Verticalized>
          <StyledText>
            <Element>
              <String>${data.customerName}</String>
              <Attributes>
                <Font Family="Arial" Size="12" Bold="True" />
              </Attributes>
            </Element>
          </StyledText>
        </TextObject>
        <TextObject>
          <Name>Device</Name>
          <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
          <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
          <LinkedObjectName></LinkedObjectName>
          <Rotation>Rotation0</Rotation>
          <IsMirrored>False</IsMirrored>
          <IsVariable>True</IsVariable>
          <HorizontalAlignment>Left</HorizontalAlignment>
          <VerticalAlignment>Top</VerticalAlignment>
          <TextFitMode>ShrinkToFit</TextFitMode>
          <UseFullFontHeight>True</UseFullFontHeight>
          <Verticalized>False</Verticalized>
          <StyledText>
            <Element>
              <String>${data.deviceType} - ${data.repairType}</String>
              <Attributes>
                <Font Family="Arial" Size="10" Bold="False" />
              </Attributes>
            </Element>
          </StyledText>
        </TextObject>
        <TextObject>
          <Name>TicketID</Name>
          <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
          <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
          <LinkedObjectName></LinkedObjectName>
          <Rotation>Rotation0</Rotation>
          <IsMirrored>False</IsMirrored>
          <IsVariable>True</IsVariable>
          <HorizontalAlignment>Left</HorizontalAlignment>
          <VerticalAlignment>Top</VerticalAlignment>
          <TextFitMode>ShrinkToFit</TextFitMode>
          <UseFullFontHeight>True</UseFullFontHeight>
          <Verticalized>False</Verticalized>
          <StyledText>
            <Element>
              <String>Ticket #${data.ticketId}</String>
              <Attributes>
                <Font Family="Arial" Size="14" Bold="True" />
              </Attributes>
            </Element>
          </StyledText>
        </TextObject>
        <BarcodeObject>
          <Name>QRCode</Name>
          <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
          <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
          <LinkedObjectName></LinkedObjectName>
          <Rotation>Rotation0</Rotation>
          <IsMirrored>False</IsMirrored>
          <IsVariable>True</IsVariable>
          <Text>${data.qrCodeData || data.ticketId}</Text>
          <Type>QRCode</Type>
          <Size>Small</Size>
        </BarcodeObject>
      </ObjectInfo>
    </DieCutLabel>`
  }

  createPartLabel(data: PartLabelData): string {
    return `<?xml version="1.0" encoding="utf-8"?>
    <DieCutLabel Version="8.0" Units="twips">
      <PaperOrientation>Portrait</PaperOrientation>
      <Id>Small30334</Id>
      <PaperName>30334 2-1/4 in x 1-1/4 in</PaperName>
      <DrawCommands>
        <RoundRectangle X="0" Y="0" Width="3240" Height="1800" Rx="180" Ry="180" />
      </DrawCommands>
      <ObjectInfo>
        <TextObject>
          <Name>PartName</Name>
          <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
          <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
          <LinkedObjectName></LinkedObjectName>
          <Rotation>Rotation0</Rotation>
          <IsMirrored>False</IsMirrored>
          <IsVariable>True</IsVariable>
          <HorizontalAlignment>Center</HorizontalAlignment>
          <VerticalAlignment>Top</VerticalAlignment>
          <TextFitMode>ShrinkToFit</TextFitMode>
          <UseFullFontHeight>True</UseFullFontHeight>
          <Verticalized>False</Verticalized>
          <StyledText>
            <Element>
              <String>${data.partName}</String>
              <Attributes>
                <Font Family="Arial" Size="10" Bold="True" />
              </Attributes>
            </Element>
          </StyledText>
        </TextObject>
        <TextObject>
          <Name>SKU</Name>
          <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
          <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
          <LinkedObjectName></LinkedObjectName>
          <Rotation>Rotation0</Rotation>
          <IsMirrored>False</IsMirrored>
          <IsVariable>True</IsVariable>
          <HorizontalAlignment>Center</HorizontalAlignment>
          <VerticalAlignment>Middle</VerticalAlignment>
          <TextFitMode>ShrinkToFit</TextFitMode>
          <UseFullFontHeight>True</UseFullFontHeight>
          <Verticalized>False</Verticalized>
          <StyledText>
            <Element>
              <String>SKU: ${data.sku}</String>
              <Attributes>
                <Font Family="Arial" Size="8" Bold="False" />
              </Attributes>
            </Element>
          </StyledText>
        </TextObject>
        <BarcodeObject>
          <Name>Barcode</Name>
          <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
          <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
          <LinkedObjectName></LinkedObjectName>
          <Rotation>Rotation0</Rotation>
          <IsMirrored>False</IsMirrored>
          <IsVariable>True</IsVariable>
          <Text>${data.barcode || data.sku}</Text>
          <Type>Code128Auto</Type>
          <Size>Small</Size>
        </BarcodeObject>
      </ObjectInfo>
    </DieCutLabel>`
  }

  async printLabel(labelXml: string, printerName?: string): Promise<boolean> {
    if (!this.isReady) {
      console.error("DYMO printer not initialized")
      return false
    }

    try {
      const printers = this.getPrinters()
      if (printers.length === 0) {
        throw new Error("No DYMO printers found")
      }

      const printer = printerName || printers[0]
      window.dymo.label.framework.printLabel(printer, null, labelXml, "")
      return true
    } catch (error) {
      console.error("Error printing label:", error)
      return false
    }
  }

  async printTicketLabel(data: TicketLabelData, printerName?: string): Promise<boolean> {
    const labelXml = this.createTicketLabel(data)
    return this.printLabel(labelXml, printerName)
  }

  async printPartLabel(data: PartLabelData, printerName?: string): Promise<boolean> {
    const labelXml = this.createPartLabel(data)
    return this.printLabel(labelXml, printerName)
  }
}

export const dymoPrinter = DymoPrinter.getInstance()
