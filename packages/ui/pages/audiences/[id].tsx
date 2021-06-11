import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import DashboardLayout from "layout/DashboardLayout";
import ProductUserTable from "components/ProductUserTable";
import DynamicTitleBar from "components/DynamicTitleBar";
import DefaultViewLayout from "layout/DefaultViewLayout";
import AudienceBuilder from "components/AudienceBuilder";
import { Condition, deserialize } from "common/filters";
import { PAGE_DEFAULTS } from "constants/page";
import { GET_AUDIENCE_WITH_PRODUCT_USERS } from "components/audience/AudienceQueries";

const AudienceByIdPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const { data, loading, error } = useQuery(GET_AUDIENCE_WITH_PRODUCT_USERS, {
    variables: {
      id: router.query.id,
    },
    onCompleted(data) {
      setTitle(data.audiences.nodes[0].name);
    },
  });
  const nodeRef = useRef<Condition>();

  useEffect(() => {
    if (nodeRef.current || !data?.audiences) {
      return;
    }
    const node = data?.audiences.nodes[0].node;
    const parsedNode = JSON.parse(node);
    const deserializedNode = deserialize(parsedNode);
    nodeRef.current = deserializedNode;
  }, [data?.audiences.nodes[0]]);

  const onChangeTitleText = (text: string) => {
    setTitle(text);
  };
  const content =
    loading || !nodeRef.current ? (
      <CircularProgress />
    ) : error ? (
      <p>An error has occured</p>
    ) : (
      <>
        <div className="content">
          <AudienceBuilder name={title} rootNode={nodeRef.current} />
          <ProductUserTable
            productUsers={data.audiences.nodes[0].productUsers}
            rows={data.audiences.rows}
          />
        </div>
        <style jsx>{`
          .content {
            border: 1px solid #d0d0d0;
            padding: 21px 17px;
            border-radius: 4px;
            margin-bottom: 4em;
            box-shadow: var(--subtle-shadow);
          }
        `}</style>
      </>
    );

  return (
    <DashboardLayout index={0}>
      <>
        <DynamicTitleBar
          title={title}
          onChangeTitleText={onChangeTitleText}
          subtitle={PAGE_DEFAULTS.audiences.id.placeholderTitle}
          showAction={false}
          placeholderTitle={PAGE_DEFAULTS.audiences.id.placeholderTitle}
          icon={<FontAwesomeIcon icon={faUserFriends} color={"#4a7da7"} />}
        ></DynamicTitleBar>
        <DefaultViewLayout>{content}</DefaultViewLayout>
      </>
    </DashboardLayout>
  );
};

export default dynamic(() => Promise.resolve(AudienceByIdPage), { ssr: false });
