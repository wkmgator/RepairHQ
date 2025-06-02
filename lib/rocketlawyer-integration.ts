export interface LegalDocument {
  type: "service_agreement" | "warranty" | "liability_waiver" | "terms_of_service"
  customerName: string
  businessName: string
  serviceDetails: string
  warrantyPeriod?: number
  customClauses?: string[]
}

export interface RocketLawyerConfig {
  apiKey: string
  baseUrl: string
  templateIds: {
    serviceAgreement: string
    warranty: string
    liabilityWaiver: string
    termsOfService: string
  }
}

export class RocketLawyerService {
  private config: RocketLawyerConfig

  constructor(config: RocketLawyerConfig) {
    this.config = config
  }

  async generateDocument(document: LegalDocument): Promise<string> {
    // This would integrate with RocketLawyer's actual API
    // For now, we'll return a placeholder URL

    const templateId = this.getTemplateId(document.type)

    const response = await fetch(`${this.config.baseUrl}/documents/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        templateId,
        variables: {
          customerName: document.customerName,
          businessName: document.businessName,
          serviceDetails: document.serviceDetails,
          warrantyPeriod: document.warrantyPeriod,
          customClauses: document.customClauses,
        },
      }),
    })

    const result = await response.json()
    return result.documentUrl
  }

  private getTemplateId(type: LegalDocument["type"]): string {
    switch (type) {
      case "service_agreement":
        return this.config.templateIds.serviceAgreement
      case "warranty":
        return this.config.templateIds.warranty
      case "liability_waiver":
        return this.config.templateIds.liabilityWaiver
      case "terms_of_service":
        return this.config.templateIds.termsOfService
      default:
        throw new Error(`Unknown document type: ${type}`)
    }
  }

  async getDocumentStatus(documentId: string): Promise<"pending" | "ready" | "signed" | "expired"> {
    const response = await fetch(`${this.config.baseUrl}/documents/${documentId}/status`, {
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
    })

    const result = await response.json()
    return result.status
  }
}
