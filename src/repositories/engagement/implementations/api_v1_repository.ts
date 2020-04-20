import { EngagementRepository } from '../engagement_repository';
import { Engagement } from '../../../models/engagement';
import { AxiosInstance } from 'axios';

export class ApiV1EngagementRepository extends EngagementRepository {
  constructor({
    axios,
    baseUrl,
  }: {
    axios?: AxiosInstance;
    baseUrl?: string;
  }) {
    super();
    if (!axios) {
      throw new Error('axios is required')
    }
    this.axios = axios;
    this.baseUrl = baseUrl;
  }
  baseUrl?: string;
  axios?: AxiosInstance;
  async fetchEngagements(): Promise<Engagement[]> {
      const {data: engagementsData} = await this.axios.get(`${this.baseUrl}/engagements`);
      return engagementsData.map((engagementMap) => new Engagement(engagementMap as Engagement));
  }
  async createEngagement(data: any): Promise<void> {
      this.axios.post(`${this.baseUrl}/engagements`, data);
  }
}