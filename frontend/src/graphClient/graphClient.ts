import { BiconomySmartAccountV2 } from "@biconomy/account";
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";

const cropCashConsumerUrl = "https://api.studio.thegraph.com/query/94953/cropcashconsumer/version/latest";
const cropCashLandNftUrl = "https://api.studio.thegraph.com/query/94953/cropcashlandnft/version/latest";

export const getFarmerNfts = (farmerAddress: string) => {
  const query = gql`
    {
      transfers(where: { to: "${farmerAddress}" }) {
        id
        from
        to
        tokenId
        transactionHash
      }
    }
  `;

  console.log(`Querying farmer (${farmerAddress}) nfts`);

  return useQuery({
    queryKey: ["transfers", farmerAddress],
    queryFn: async () => {
      console.log("Getting graph data");
      const data = await request(cropCashLandNftUrl, query);
      console.log("GRAPHQL DATA", data);
      return data;
    },
  });
};

export const getFarmerNftDetails = () => {
  const query = gql`
    {
      landObjectUpdateds {
        id
        tokenId
        sizeInHectare
      }
    }
  `;

  console.log(`Querying farmer nfts details`);

  return useQuery({
    queryKey: ["farmerNftDetails"],
    queryFn: async () => {
      console.log("Getting graph data");
      const data = await request(cropCashConsumerUrl, query);
      console.log("GRAPHQL DATA", data);
      return data;
    },
  });
};

export const getLoanInitializeds = (farmerAddress: string) => {
  const query = gql`
    {
      loanInitiliazeds(where: { landOwner: "${farmerAddress}" }) {
        id
        tokenId
        amount
      }
    }
  `;

  console.log(`Querying farmer nfts initialized loans`);

  return useQuery({
    queryKey: ["loanInitializeds", farmerAddress],
    queryFn: async () => {
      console.log("Getting graph data");
      const data = await request(cropCashConsumerUrl, query);
      console.log("GRAPHQL DATA", data);
      return data;
    },
  });
};

export const getAllLoanNfts = () => {
  const query = gql`
    {
      loanInitiliazeds {
        id
        tokenId
        amount
      }
    }
  `;

  console.log(`Querying all loan nfts`);

  return useQuery({
    queryKey: ["getAllLoanNfts"],
    queryFn: async () => {
      console.log("Getting graph data");
      const data = await request(cropCashConsumerUrl, query);
      console.log("GRAPHQL DATA", data);
      return data;
    },
  });
};
