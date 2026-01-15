// TypeScript types for Story Protocol IP Assets

export interface IPAsset {
  id: string;
  ipId: string;
  tokenContract: string;
  tokenId: string;
  chainId: number;
  owner: string;
  blockNumber: number;
  blockTimestamp: number;
  metadata?: IPMetadata;
  licenseTerms?: LicenseTerms[];
  parents?: string[];
  children?: string[];
  royaltyPolicy?: string;
  totalRevenue?: string;
}

export interface IPMetadata {
  name?: string;
  description?: string;
  mediaType?: 'image' | 'audio' | 'video' | 'text' | 'other';
  imageUrl?: string;
  externalUrl?: string;
  attributes?: MetadataAttribute[];
}

export interface MetadataAttribute {
  trait_type: string;
  value: string | number;
}

export interface LicenseTerms {
  id: string;
  licenseTermsId: string;
  licenseTemplate: string;
  transferable: boolean;
  royaltyPolicy: string;
  defaultMintingFee: string;
  currency: string;
  commercialUse: boolean;
  commercialAttribution: boolean;
  commercializerChecker: string;
  derivativesAllowed: boolean;
  derivativesAttribution: boolean;
  derivativeApprovalRequired: boolean;
  derivativeRevShare: number;
}

export interface GraphNode {
  id: string;
  ipId: string;
  name: string;
  owner: string;
  timestamp: number;
  mediaType?: string;
  licenseType: string;
  derivativeCount: number;
  parentCount: number;
  revenue: number;
  commercialUse: boolean;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: 'derivative' | 'license' | 'royalty';
  royaltyShare?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface FilterOptions {
  searchQuery?: string;
  licenseTypes?: string[];
  mediaTypes?: string[];
  dateRange?: {
    start: number;
    end: number;
  };
  minRevenue?: number;
  maxRevenue?: number;
  commercialOnly?: boolean;
  hasDerivatives?: boolean;
}

export interface IPStats {
  totalIPs: number;
  totalDerivatives: number;
  totalRevenue: string;
  mostRemixedIPs: { ipId: string; count: number; name?: string }[];
  licenseDistribution: { [key: string]: number };
  mediaTypeDistribution: { [key: string]: number };
  ipsOverTime: { date: string; count: number }[];
}
