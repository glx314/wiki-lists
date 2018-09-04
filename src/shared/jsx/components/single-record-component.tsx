import * as React from "react";
import {SingleRecordProps} from "../common-props";
import {RouteComponentProps, withRouter} from "react-router"
import {attrLabel, ellipsis, filterAttribute} from "../utils/utils";
import {ValueHandler} from "../type-handlers/editors";
import {Attribute} from "../../model/types";

type SingleRecordComponentProps = SingleRecordProps & RouteComponentProps<{}>;

const NAME_ELLIPSIS = 10;

export const SingleRecordComponent : React.SFC<SingleRecordComponentProps> = (props) => {

    // filter out attributes that are part of the name (already shown)
    let filterAttributeFunc = (attr:Attribute) => filterAttribute(props, props.schema)(attr) && !attr.isName;

    return <>
        {props.schema.attributes
            .filter(filterAttributeFunc).map((attr : Attribute) =>
                <div style={{marginBottom: "0.5em"}}>
                    <b>{
                        props.large ?
                            attrLabel(attr) :
                            ellipsis(attrLabel(attr), NAME_ELLIPSIS)} : </b>

                    {props.large && <br/>}

                    <ValueHandler
                        editMode={false}
                        value={props.record[attr.name]}
                        type={attr.type} />
                </div>)}
    </>
};