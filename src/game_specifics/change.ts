


export enum UpdateType{
    UpdateSet = 0, //set value

	// list type operation
	UpdateAdd,
	UpdateRemove,

	// whole object type operation
	UpdateCreate,
	UpdateDestroy,
}

export interface Change{
    Id: string,
    Option: UpdateType
    Property: string,
    Value: {
        Old: any,
        New: any
    }
}